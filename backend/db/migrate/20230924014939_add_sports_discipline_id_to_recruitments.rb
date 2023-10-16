class AddSportsDisciplineIdToRecruitments < ActiveRecord::Migration[7.0]
  def change
    add_reference :recruitments, :sports_discipline, foreign_key: true
  end
end
