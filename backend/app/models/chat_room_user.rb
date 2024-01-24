class ChatRoomUser < ApplicationRecord
  belongs_to :user
  belongs_to :chat_room

  def increment_chat_count_and_check_payment!
    increment!(:chat_count)
    if chat_count > 5
      chat_room.make_paid! 
      chat_room.create_stripe_checkout_session!
    end
  end
end
