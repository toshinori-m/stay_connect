class ChatMessage < ApplicationRecord
  belongs_to :chat_room
  belongs_to :user

  validates :message, presence: true, length: { maximum: 255 }
  validates :read, inclusion: [true, false]

  def self.create_with_user_and_room!(chat_room, user, message_params)
    chat_message = chat_room.chat_messages.new(message_params.merge(user: user))

    ActiveRecord::Base.transaction do
      chat_message.save!
      chat_room_user = chat_room.chat_room_users.find_by(user: user)
      chat_room_user&.increment_chat_count_and_check_payment!
    end

    chat_message
  end
end
