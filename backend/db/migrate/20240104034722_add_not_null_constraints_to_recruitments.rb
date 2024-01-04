class AddNotNullConstraintsToRecruitments < ActiveRecord::Migration[7.0]
  def change
    change_column_null :recruitments, :user_id, false
    change_column_null :recruitments, :prefecture_id, false
    change_column_null :recruitments, :sports_type_id, false
  end
end
