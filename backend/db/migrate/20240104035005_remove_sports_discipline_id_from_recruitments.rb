class RemoveSportsDisciplineIdFromRecruitments < ActiveRecord::Migration[7.0]
  def change
    remove_column :recruitments, :sports_discipline_id, :bigint
  end
end
