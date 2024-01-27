class AddChatCountToChatRoomUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :chat_room_users, :chat_count, :bigint, default: 0
  end
end
