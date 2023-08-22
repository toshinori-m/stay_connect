class CreateChatMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :chat_messages do |t|
      ## User Info
      t.references :user
      t.references :chat_room
      t.string :message
      t.timestamps
    end
  end
end
