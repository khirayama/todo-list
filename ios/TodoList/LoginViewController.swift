//
//  ViewController.swift
//  TodoList
//
//  Created by Kotaro Hirayama on 2017/03/27.
//  Copyright © 2017 Kotaro Hirayama. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class LoginViewController: UIViewController {

  @IBOutlet weak var emailTextField: UITextField!

  @IBOutlet weak var passwordTextField: UITextField!

  @IBAction func signInButtonPress(_ sender: Any) {
    postCredentials(endpoint: APIEndpoints.signinURL)
  }

  @IBAction func signUpButtonPress(_ sender: Any) {
    postCredentials(endpoint: APIEndpoints.signupURL)
  }

  func postCredentials(endpoint: String) {
    let loader = SwiftLoading()
    loader.showLoading()
    
    if let email = emailTextField.text, let password = passwordTextField.text {
      let parameters: Parameters = [
        "email": email,
        "password": password,
        ]
      print(parameters)
      Alamofire.request(endpoint, method: .post, parameters: parameters, encoding: JSONEncoding.default).responseJSON { response in
        switch response.result {
        case .success:
          if let value = response.result.value {
            let defaults = UserDefaults.standard
            let json = JSON(value)
            defaults.setValue(json["token"].string, forKey: "jwtToken")
            defaults.setValue(json["userId"].string, forKey: "userId")
            
            self.navigationController!.performSegue(withIdentifier: "showTodosViewController", sender: nil)
          }
        case .failure(let error):
          print(error)
        }
        loader.hideLoading()
      }
    }
  }
  
  override func viewDidLoad() {
    super.viewDidLoad()
    self.navigationItem.hidesBackButton = true;
  }
}
