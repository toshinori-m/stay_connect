class CreateChatRoomUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :chat_room_users do |t|
      ## User Info
      t.references :user
      t.references :chat_room
      t.timestamps
    end
  end
end
