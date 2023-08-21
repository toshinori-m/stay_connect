class Team < ApplicationRecord
  belongs_to :user
  belongs_to :sports_types
  belongs_to :areas

  has_many :team_target_ages

  validates :user_id, presence: true
  validates :aim, presence: true, length: { maximum: 140 }
end
