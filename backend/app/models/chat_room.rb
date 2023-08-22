class ChatRoom < ApplicationRecord
  has_many :chat_room_users
  has_many :chat_messages

  enum paid_or_free: { paid: true, free: false }
  validates :paid_or_free, presence: true
end
