# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, 
         :recoverable, :rememberable, :validatable, password_length: 2..128
  include DeviseTokenAuth::Concerns::User

  has_many :teams
  has_many :recruitments
  has_many :chat_room_users
  has_many :chat_messages

  validates :name, presence: true, length: { minimum: 2 }
  enum sex: { man: 0, woman: 1 }
  validates :email, presence: true
  validates :email, uniqueness: true
  # validates :password, presence: true, length: { minimum: 2 }
  # validates :encrypted_password, presence: true, length: { minimum: 2 }
  enum email_notification: { receivez: true, not_receive: false }
  validates :email_notification, presence: true
end
