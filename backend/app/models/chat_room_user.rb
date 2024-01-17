class ChatRoomUser < ApplicationRecord
  belongs_to :user
  belongs_to :chat_room

  def increment_chat_count_and_check_payment
    increment!(:chat_count)
    if chat_count > 5
      chat_room.make_paid
    end
  end
end
