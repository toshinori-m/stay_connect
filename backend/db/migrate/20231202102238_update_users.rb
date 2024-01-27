class UpdateUsers < ActiveRecord::Migration[7.0]
  def change
    change_column_null :users, :encrypted_password, true
    change_column_default :users, :encrypted_password, from: "", to: nil
    change_column_default :users, :provider, from: "email", to: nil
    change_column_default :users, :allow_password_change, from: false, to: nil
  end
end
