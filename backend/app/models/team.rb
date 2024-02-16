class Team < ApplicationRecord
  belongs_to :user
  belongs_to :sports_type
  belongs_to :prefecture

  has_many :team_target_ages, dependent: :destroy
  has_many :target_ages,  through: :team_target_ages
  has_many :team_sports_disciplines, dependent: :destroy
  has_many :sports_disciplines, through: :team_sports_disciplines

  validates :name, presence: true, length: { maximum: 255 }
  validates :area, presence: true, length: { maximum: 255 }
  enum sex: { man: 0, woman: 1, mix: 2, man_and_woman: 3 }
  validates :sex, presence: true
  validates :track_record, presence: true
end
