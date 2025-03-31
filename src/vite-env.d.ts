
/// <reference types="vite/client" />

// Declaration for ElevenLabs Conversational AI Widget
declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        'agent-id': string;
      },
      HTMLElement
    >;
  }
}
