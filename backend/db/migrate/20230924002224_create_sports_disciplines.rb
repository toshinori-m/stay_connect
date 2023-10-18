class CreateSportsDisciplines < ActiveRecord::Migration[7.0]
  def change
    create_table :sports_disciplines do |t|
      t.references :sports_type
      t.string :name
      t.timestamps
    end
  end
end
