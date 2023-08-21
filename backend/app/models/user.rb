# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_many :teams
  has_many :recruitments
  has_many :chat_room_users
  has_many :chat_messages

  validates :name, presence: true, length: { in: 2..50 }
  validates :image, length: { maximum: 255 }
  validates :birthday, presence: true
  # enum sex : { man: 0, woman: 1 }
  validates :sex, numericality: { only_integer: true }
  validates :email, presence: true, length: { maximum: 255 }
  validates :email, uniqueness: true
  validates :password, presence: true, length: { in: 5..255 }
  validates :email_notification, presence: true
end
