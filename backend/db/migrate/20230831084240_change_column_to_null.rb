class ChangeColumnToNull < ActiveRecord::Migration[7.0]
  def up
    change_column_null :recruitments, :prefecture_id, true
  end

  def down
    change_column_null :recruitments, :prefecture_id, false
  end
end
