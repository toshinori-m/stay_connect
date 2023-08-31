class Team < ApplicationRecord
  belongs_to :user
  belongs_to :sports_type
  belongs_to :prefecture

  has_many :team_target_ages, dependent: :destroy
  has_many :target_ages,  through: :appointments

  validates :name, presence: true, length: { minimum: 2 }
  validates :area, presence: true, length: { minimum: 2 }
  enum sex: { man: 0, woman: 1, mix: 2 }
  validates :sex, presence: true
  validates :track_record, presence: true
end
