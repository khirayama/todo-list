//
//  NewTodoViewController.swift
//  TodoList
//
//  Created by Kotaro Hirayama on 2017/04/05.
//  Copyright © 2017 Kotaro Hirayama. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class NewTodoViewController: UIViewController {
  
  @IBOutlet weak var newTodoTextField: UITextField!
  
  @IBAction func addButtonPress(_ sender: Any) {
    let loader = SwiftLoading()
    loader.showLoading()
    
    if let text = newTodoTextField.text {
      let defaults = UserDefaults.standard
      let userId = defaults.value(forKey: "userId") as! String
      let parameters = [
        "text": text
      ]
      Alamofire.request(APIEndpoints.newTodoURL(userId: userId), method: .post, parameters: parameters, encoding: JSONEncoding.default).responseJSON { response in
        switch response.result {
        case .success:
          if let value = response.result.value {
            let defaults = UserDefaults.standard
            let json = JSON(value)
            
            if let todosArray = defaults.value(forKey: "todosArray") {
              let todosArray = NSMutableArray(array: todosArray as! [AnyObject])
              
              if let todoText = json["text"].string {
                todosArray.add(todoText)
                defaults.setValue(todosArray, forKey: "todosArray")
              } else {
                print("Could not get 'text' from JSON")
              }
            } else {
              if let todoText = json["text"].string {
                defaults.setValue(NSMutableArray(array: [todoText]), forKey: "todosArray")
              } else {
                print("Could not get 'text' from JSON")
              }
            }
            
            self.navigationController!.performSegue(withIdentifier: "showTodosViewController", sender: nil)
          }
        case .failure(let error):
          print(error)
        }
        loader.hideLoading()
      }
    } else {
      print("No text!")
      loader.hideLoading()
    }
  }
}
