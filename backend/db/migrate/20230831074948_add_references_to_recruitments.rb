class AddReferencesToRecruitments < ActiveRecord::Migration[7.0]
  def change
    add_reference :recruitments, :prefecture, null: false, foreign_key: true
  end
end
