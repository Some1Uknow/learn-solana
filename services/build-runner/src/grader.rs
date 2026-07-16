use {
    mollusk_svm::{program::loader_keys::LOADER_V3, Mollusk, MolluskContext},
    serde::{Deserialize, Serialize},
    sha2::{Digest, Sha256},
    solana_account::{Account, ReadableAccount},
    solana_instruction::{AccountMeta, Instruction},
    solana_pubkey::Pubkey,
    solana_sdk_ids::system_program,
    std::collections::HashMap,
};

const PROGRAM_ID: Pubkey = solana_pubkey::pubkey!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
const STARTING_LAMPORTS: u64 = 10_000_000_000;
const DEPOSIT_AMOUNT: u64 = 1_000_000;
const WITHDRAW_AMOUNT: u64 = 400_000;

#[derive(Debug, Deserialize, Serialize)]
pub struct CheckResult {
    pub key: String,
    pub label: String,
    pub status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hint: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GradeResult {
    pub checks: Vec<CheckResult>,
    pub hidden: HiddenResult,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct HiddenResult {
    pub passed: usize,
    pub total: usize,
}

#[derive(Debug, Serialize)]
pub struct GradeReport {
    pub status: String,
    pub summary: String,
    pub result: GradeResult,
}

struct World {
    context: MolluskContext<HashMap<Pubkey, Account>>,
    authority: Pubkey,
    vault: Pubkey,
}

impl World {
    fn new(elf: &[u8]) -> Self {
        let authority = Pubkey::new_unique();
        let (vault, _) = Pubkey::find_program_address(&[b"vault", authority.as_ref()], &PROGRAM_ID);
        let mut mollusk = Mollusk::default();
        mollusk.add_program_with_loader_and_elf(&PROGRAM_ID, &LOADER_V3, elf);
        let accounts = HashMap::from([(
            authority,
            Account::new(STARTING_LAMPORTS, 0, &system_program::ID),
        )]);
        Self {
            context: mollusk.with_context(accounts),
            authority,
            vault,
        }
    }

    fn process(&self, instruction: Instruction) -> Result<(), String> {
        self.context
            .process_instruction(&instruction)
            .raw_result
            .map_err(|_| "instruction was rejected".to_string())
    }

    fn initialize(&self) -> Result<(), String> {
        self.process(Instruction::new_with_bytes(
            PROGRAM_ID,
            &anchor_discriminator("initialize"),
            vec![
                AccountMeta::new(self.authority, true),
                AccountMeta::new(self.vault, false),
                AccountMeta::new_readonly(system_program::ID, false),
            ],
        ))
    }

    fn deposit(&self, amount: u64) -> Result<(), String> {
        self.process(Instruction::new_with_bytes(
            PROGRAM_ID,
            &amount_data("deposit", amount),
            vec![
                AccountMeta::new(self.authority, true),
                AccountMeta::new(self.vault, false),
                AccountMeta::new_readonly(system_program::ID, false),
            ],
        ))
    }

    fn withdraw(&self, amount: u64) -> Result<(), String> {
        self.process(Instruction::new_with_bytes(
            PROGRAM_ID,
            &amount_data("withdraw", amount),
            vec![
                AccountMeta::new(self.authority, true),
                AccountMeta::new(self.vault, false),
            ],
        ))
    }

    fn close(&self) -> Result<(), String> {
        self.process(Instruction::new_with_bytes(
            PROGRAM_ID,
            &anchor_discriminator("close_vault"),
            vec![
                AccountMeta::new(self.authority, true),
                AccountMeta::new(self.vault, false),
            ],
        ))
    }

    fn vault_account(&self) -> Option<Account> {
        self.context.account_store.borrow().get(&self.vault).cloned()
    }

    fn authority_account(&self) -> Option<Account> {
        self.context.account_store.borrow().get(&self.authority).cloned()
    }

    fn vault_state(&self) -> Option<(Pubkey, u8, u64)> {
        let account = self.vault_account()?;
        let data = account.data();
        if data.len() < 49 {
            return None;
        }
        let authority = Pubkey::try_from(&data[8..40]).ok()?;
        let bump = data[40];
        let tracked_balance = u64::from_le_bytes(data[41..49].try_into().ok()?);
        Some((authority, bump, tracked_balance))
    }
}

pub fn grade(challenge_slug: &str, stage_slug: &str, elf: &[u8]) -> GradeReport {
    if challenge_slug != "sol-vault" {
        return error_report("Unknown build challenge.", "unknown_challenge");
    }
    let report = match stage_slug {
        "create-vault" => grade_create_vault(elf),
        "accept-deposits" => grade_accept_deposits(elf),
        "withdraw-safely" => grade_withdraw_safely(elf),
        "defend-the-vault" => grade_defend_the_vault(elf),
        "close-cleanly" => grade_close_cleanly(elf),
        _ => error_report("Unknown build stage.", "unknown_stage"),
    };
    report
}

fn grade_create_vault(elf: &[u8]) -> GradeReport {
    let world = World::new(elf);
    let initialized = world.initialize().is_ok();
    let expected = Pubkey::find_program_address(&[b"vault", world.authority.as_ref()], &PROGRAM_ID);
    let correct_pda = initialized && world.vault == expected.0;
    let correct_state = world
        .vault_state()
        .map(|(authority, bump, balance)| authority == world.authority && bump == expected.1 && balance == 0)
        .unwrap_or(false);
    let hidden = usize::from(initialized && world.initialize().is_err());
    report(
        vec![
            check("vault-pda", "Derives the vault PDA", correct_pda, "Initialize the PDA from the vault namespace and authority."),
            check("vault-state", "Stores vault state", correct_state, "Store authority, bump, and a zero tracked balance."),
        ],
        hidden,
        1,
    )
}

fn grade_accept_deposits(elf: &[u8]) -> GradeReport {
    let world = World::new(elf);
    let initialized = world.initialize().is_ok();
    let before = world.vault_account().map(|account| account.lamports()).unwrap_or_default();
    let deposited = initialized && world.deposit(DEPOSIT_AMOUNT).is_ok();
    let after = world.vault_account().map(|account| account.lamports()).unwrap_or_default();
    let state = world.vault_state();
    let cpi_moved_lamports = deposited && after == before.saturating_add(DEPOSIT_AMOUNT);
    let tracks_balance = state.map(|(_, _, balance)| balance == DEPOSIT_AMOUNT).unwrap_or(false);
    let hidden = usize::from(world.deposit(0).is_err()) + usize::from(world.deposit(u64::MAX).is_err());
    report(
        vec![
            check("deposit-cpi", "Moves SOL with a CPI", cpi_moved_lamports, "Transfer lamports into the vault through the system program."),
            check("tracked-balance", "Tracks deposited SOL", tracks_balance, "Update tracked balance after a successful transfer."),
        ],
        hidden,
        2,
    )
}

fn grade_withdraw_safely(elf: &[u8]) -> GradeReport {
    let world = World::new(elf);
    let ready = world.initialize().is_ok() && world.deposit(DEPOSIT_AMOUNT).is_ok();
    let authority_before = world.authority_account().map(|account| account.lamports()).unwrap_or_default();
    let withdrawn = ready && world.withdraw(WITHDRAW_AMOUNT).is_ok();
    let authority_after = world.authority_account().map(|account| account.lamports()).unwrap_or_default();
    let state = world.vault_state();
    let authority_paid = withdrawn && authority_after == authority_before.saturating_add(WITHDRAW_AMOUNT);
    let invariants_hold = state
        .map(|(_, _, balance)| balance == DEPOSIT_AMOUNT - WITHDRAW_AMOUNT)
        .unwrap_or(false);
    let hidden = usize::from(world.withdraw(0).is_err())
        + usize::from(world.withdraw(DEPOSIT_AMOUNT).is_err())
        + usize::from(world.vault_account().map(|account| account.lamports() > 0).unwrap_or(false));
    report(
        vec![
            check("authority-withdrawal", "Lets the authority withdraw", authority_paid, "Transfer the requested lamports to the stored authority."),
            check("withdrawal-invariants", "Keeps vault invariants", invariants_hold, "Subtract from tracked balance only after every withdrawal check passes."),
        ],
        hidden,
        3,
    )
}

fn grade_defend_the_vault(elf: &[u8]) -> GradeReport {
    let world = World::new(elf);
    let ready = world.initialize().is_ok() && world.deposit(DEPOSIT_AMOUNT).is_ok();
    let rejects_bad_input = ready && world.deposit(0).is_err() && world.withdraw(0).is_err() && world.withdraw(DEPOSIT_AMOUNT + 1).is_err();
    let before = world.vault_account().map(|account| account.lamports()).unwrap_or_default();
    let all_withdrawn = ready && world.withdraw(DEPOSIT_AMOUNT).is_ok();
    let after = world.vault_account().map(|account| account.lamports()).unwrap_or_default();
    let keeps_rent_floor = all_withdrawn && after > 0 && after < before;
    let hidden = usize::from(world.withdraw(1).is_err() || world.vault_state().map(|(_, _, balance)| balance == 0).unwrap_or(false))
        + usize::from(world.vault == Pubkey::find_program_address(&[b"vault", world.authority.as_ref()], &PROGRAM_ID).0)
        + usize::from(world.vault_account().map(|account| account.lamports() > 0).unwrap_or(false));
    report(
        vec![
            check("rejects-bad-input", "Rejects bad input", rejects_bad_input, "Reject zero amounts and withdrawals that exceed recorded balance."),
            check("keeps-rent-floor", "Preserves the rent floor", keeps_rent_floor, "Do not transfer the lamports that keep the state account alive."),
        ],
        hidden,
        3,
    )
}

fn grade_close_cleanly(elf: &[u8]) -> GradeReport {
    let world = World::new(elf);
    let ready = world.initialize().is_ok() && world.deposit(DEPOSIT_AMOUNT).is_ok();
    let rejects_nonempty_close = ready && world.close().is_err();
    let drained = ready && world.withdraw(DEPOSIT_AMOUNT).is_ok();
    let authority_before = world.authority_account().map(|account| account.lamports()).unwrap_or_default();
    let closed = drained && world.close().is_ok();
    let vault = world.vault_account();
    let authority_after = world.authority_account().map(|account| account.lamports()).unwrap_or_default();
    let closes_empty = closed && vault.as_ref().map(|account| account.lamports() == 0 && account.data().is_empty()).unwrap_or(false);
    let protects_remaining = rejects_nonempty_close && authority_after > authority_before;
    let hidden = usize::from(rejects_nonempty_close) + usize::from(closes_empty);
    report(
        vec![
            check("closes-empty-vault", "Closes an empty vault", closes_empty, "Use Anchor's close constraint after the recorded balance reaches zero."),
            check("protects-remaining-sol", "Protects remaining SOL", protects_remaining, "Refuse to close while tracked balance is nonzero."),
        ],
        hidden,
        2,
    )
}

fn anchor_discriminator(name: &str) -> Vec<u8> {
    Sha256::digest(format!("global:{name}").as_bytes())[..8].to_vec()
}

fn amount_data(name: &str, amount: u64) -> Vec<u8> {
    let mut data = anchor_discriminator(name);
    data.extend_from_slice(&amount.to_le_bytes());
    data
}

fn check(key: &str, label: &str, passed: bool, message: &str) -> CheckResult {
    CheckResult {
        key: key.to_string(),
        label: label.to_string(),
        status: if passed { "passed" } else { "failed" }.to_string(),
        message: (!passed).then(|| message.to_string()),
        hint: None,
    }
}

fn report(checks: Vec<CheckResult>, hidden_passed: usize, hidden_total: usize) -> GradeReport {
    let passed = checks.iter().all(|check| check.status == "passed") && hidden_passed == hidden_total;
    GradeReport {
        status: if passed { "passed" } else { "failed" }.to_string(),
        summary: if passed { "Every check passed." } else { "Fix the failed checks, rebuild, and test again." }.to_string(),
        result: GradeResult { checks, hidden: HiddenResult { passed: hidden_passed, total: hidden_total } },
    }
}

fn error_report(summary: &str, _code: &str) -> GradeReport {
    GradeReport {
        status: "error".to_string(),
        summary: summary.to_string(),
        result: GradeResult { checks: vec![], hidden: HiddenResult { passed: 0, total: 0 } },
    }
}
