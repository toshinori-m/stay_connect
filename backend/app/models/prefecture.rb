class Prefecture < ApplicationRecord
  has_many :recruitments
  has_many :teams

  validates :name, presence: true, length: { minimum: 2 }
end
