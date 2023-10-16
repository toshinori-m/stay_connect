class SportsDiscipline < ApplicationRecord
  belongs_to :sports_type

  has_many :recruitment_sports_disciplines, dependent: :destroy
  has_many :recruitments, through: :recruitment_sports_disciplines
  has_many :team_sports_disciplines, dependent: :destroy
  has_many :teams, through: :team_sports_disciplines
end
