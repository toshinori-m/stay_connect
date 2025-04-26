declare module '@rails/actioncable' {
  export function createConsumer(url?: string): ActionCable.Cable
}

declare namespace ActionCable {
  interface Cable {
    subscriptions: Subscriptions
  }

  interface Subscriptions {
    create(
      channel: object,
      callbacks: SubscriptionCallbacks
    ): Subscription
  }

  interface SubscriptionCallbacks {
    connected?(): void
    disconnected?(): void
    received?(data: ChatMessage): void
  }

  interface Subscription {
    unsubscribe(): void
  }

  interface ChatMessage {
    id: number
    name: string
    message: string
    created_at: string
    read: boolean
  }
}
