class ChatRoomUser < ApplicationRecord
  belongs_to :user
  belongs_to :chat_room

  def increment_chat_count_and_check_payment!
    increment!(:chat_count)
    
    chat_room.make_paid! if chat_count > 5
  end
end
