class ChatRoom < ApplicationRecord
  has_many :chat_messages

  has_many :chat_room_users, dependent: :destroy
  has_many :users,  through: :chat_room_users

  validates :paid_or_free, inclusion: [true, false]
end
