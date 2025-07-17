import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import { BookOpen, FileCode, Mic } from "lucide-react";

export default function VoiceAssistant() {
  return (
    <>
      <SidebarTrigger className="fixed right-8 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-xs p-3 rounded-full shadow-lg z-40">
        <Mic className="h-5 w-5" />
      </SidebarTrigger>

      <Sidebar
        side="right"
        variant="floating"
        collapsible="offcanvas"
        className="z-50"
      >
        <div className="h-full bg-linear-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20 rounded-l-2xl">
          <SidebarHeader className="border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Voice Assistant
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white/60">Ready</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-6">
            <div className="text-white/80 space-y-6">
              <p className="text-lg">
                Voice assistant features coming soon...
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
                  <div className="flex items-center space-x-3 mb-2">
                    <Mic className="h-5 w-5 text-blue-400" />
                    <h4 className="font-semibold text-white">
                      Voice Commands
                    </h4>
                  </div>
                  <p className="text-sm text-white/70">
                    Ask questions about the topic
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
                  <div className="flex items-center space-x-3 mb-2">
                    <BookOpen className="h-5 w-5 text-purple-400" />
                    <h4 className="font-semibold text-white">
                      AI Assistance
                    </h4>
                  </div>
                  <p className="text-sm text-white/70">
                    Get explanations and help
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileCode className="h-5 w-5 text-green-400" />
                    <h4 className="font-semibold text-white">Voice Notes</h4>
                  </div>
                  <p className="text-sm text-white/70">
                    Record your thoughts
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10">
                <p className="text-sm text-white/60 text-center">
                  Try saying: "Explain this topic" or "What comes next?"
                </p>
              </div>
            </div>
          </SidebarContent>
        </div>
      </Sidebar>
    </>
  );
}
