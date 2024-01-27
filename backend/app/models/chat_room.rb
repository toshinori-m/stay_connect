class ChatRoom < ApplicationRecord
  has_many :chat_messages

  has_many :chat_room_users, dependent: :destroy
  has_many :users,  through: :chat_room_users

  validates :paid_or_free, inclusion: [true, false]

  def other_user(user_id:)
    chat_room_users.where.not(user_id: user_id).first&.user
  end

  def self.find_or_create_by_users!(user1_id, user2_id)
      chat_room_1_ids = ChatRoom.joins(:chat_room_users)
                                .where(chat_room_users: { user_id: user1_id }).ids
      chat_room = ChatRoom.where(id: chat_room_1_ids)
                          .joins(:chat_room_users)
                          .where(chat_room_users: { user_id: user2_id })
                          .distinct.first

    return chat_room if chat_room.present?

    ChatRoom.transaction do
      chat_room = ChatRoom.create!
      chat_room.chat_room_users.create!(user_id: user1_id)
      chat_room.chat_room_users.create!(user_id: user2_id)
    end
    chat_room
  end
  
  def make_paid!
    update!(paid_or_free: true)
  end

  def notify_other_users(chat_message)
    users.where.not(id: chat_message.user.id).distinct.each do |user|
      UserMailer.with(user_name: chat_message.user.name, user_message: chat_message.message, recipient_email: user.email, recipient_name: user.name).new_message_notification.deliver_later
    end
  end
end
