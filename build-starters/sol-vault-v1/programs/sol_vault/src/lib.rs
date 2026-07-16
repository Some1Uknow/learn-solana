use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod sol_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.bump = ctx.bumps.vault;
        vault.tracked_balance = 0;
        Ok(())
    }

    pub fn deposit(_ctx: Context<Deposit>, _amount: u64) -> Result<()> {
        // Stage 2: reject zero, invoke the system program, then update tracked_balance.
        err!(VaultError::StageNotReady)
    }

    pub fn withdraw(_ctx: Context<Withdraw>, _amount: u64) -> Result<()> {
        // Stage 3 and 4: enforce authority, balances, and the rent floor.
        err!(VaultError::StageNotReady)
    }

    pub fn close_vault(_ctx: Context<CloseVault>) -> Result<()> {
        // Stage 5: require an empty tracked balance before Anchor closes the account.
        err!(VaultError::StageNotReady)
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault", authority.key().as_ref()],
        bump,
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", authority.key().as_ref()],
        bump = vault.bump,
        has_one = authority,
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", authority.key().as_ref()],
        bump = vault.bump,
        has_one = authority,
    )]
    pub vault: Account<'info, Vault>,
}

#[derive(Accounts)]
pub struct CloseVault<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        close = authority,
        seeds = [b"vault", authority.key().as_ref()],
        bump = vault.bump,
        has_one = authority,
    )]
    pub vault: Account<'info, Vault>,
}

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub authority: Pubkey,
    pub bump: u8,
    pub tracked_balance: u64,
}

#[error_code]
pub enum VaultError {
    #[msg("This vault stage is not implemented yet.")]
    StageNotReady,
    #[msg("Amount must be greater than zero.")]
    AmountMustBePositive,
    #[msg("Vault tracked balance is too low.")]
    InsufficientTrackedBalance,
    #[msg("Withdrawal would violate the vault rent floor.")]
    RentFloorViolation,
    #[msg("Empty the vault before closing it.")]
    VaultMustBeEmpty,
    #[msg("Vault balance arithmetic overflowed.")]
    ArithmeticOverflow,
}
