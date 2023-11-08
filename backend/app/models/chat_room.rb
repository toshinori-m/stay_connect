class ChatRoom < ApplicationRecord
  has_many :chat_messages

  has_many :chat_room_users, dependent: :destroy
  has_many :users,  through: :chat_room_users

  enum paid_or_free: { paid: true, free: false }
  validates :paid_or_free, presence: true
end
