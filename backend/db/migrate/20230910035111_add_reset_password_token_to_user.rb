class AddResetPasswordTokenToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :reset_password_token, :string
    add_index :users, :reset_password_token, unique: true
    add_column :users, :reset_password_sent_at, :datetime
    add_column :users, :allow_password_change, :boolean, default: false, null: false
  end
end
