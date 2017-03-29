//
//  APIEndpoints.swift
//  TodoList
//
//  Created by Kotaro Hirayama on 2017/03/27.
//  Copyright © 2017 Kotaro Hirayama. All rights reserved.
//

import Foundation

class APIEndpoints {
  private static let baseURL = "http://localhost:3000/v1"
  static let signupURL = "\(baseURL)/signup"
  static let signinURL = "\(baseURL)/signin"
}
