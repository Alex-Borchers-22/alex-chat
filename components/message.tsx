import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type Role = "user" | "assistant";

interface MessageProps {
  role: Role;
  content: string;
}

export function Message({ role, content }: MessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {isUser ? (
          // Treat user text as plain text (safe + predictable)
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          // Render assistant text as markdown
          <div className="prose prose-sm max-w-none whitespace-pre-wrap dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Make code blocks look sane with Tailwind
                code({ className, children, ...props }) {
                  const isBlock = Boolean(className);
                  return isBlock ? (
                    <code
                      className={`block overflow-x-auto rounded-md p-3 ${className}`}
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10" {...props}>
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <pre className="m-0">{children}</pre>;
                },
                a({ children, ...props }) {
                  return (
                    <a className="underline underline-offset-2" target="_blank" rel="noreferrer" {...props}>
                      {children}
                    </a>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
