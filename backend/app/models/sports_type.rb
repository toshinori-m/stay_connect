class SportsType < ApplicationRecord
  has_one :recruitment
  has_one :team
  # belongs_to :team

  validates :name, presence: true, length: { minimum: 2 }
end
