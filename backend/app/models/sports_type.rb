class SportsType < ApplicationRecord
  has_one :team
  has_many :recruitments
  has_many :sports_disciplines

  validates :name, presence: true, length: { minimum: 2 }
end
