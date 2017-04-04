//
//  TableViewController.swift
//  TodoList
//
//  Created by Kotaro Hirayama on 2017/03/30.
//  Copyright © 2017 Kotaro Hirayama. All rights reserved.
//

import UIKit

class TableViewController: UITableViewController {
  
  let falseData = ["Test 1", "Test 2", "Test 3"]

  @IBAction func logoutButtonPress(_ sender: Any) {
    let defaults = UserDefaults.standard
    defaults.removeObject(forKey: "jstToken")
    
    self.navigationController!.performSegue(withIdentifier: "showLoginViewController", sender: nil)
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    
    self.tableView.estimatedRowHeight = 68.0
    self.tableView.rowHeight = UITableViewAutomaticDimension
  }
  
  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
  }
  
  // MARK: - Table view data source
  
  override func numberOfSections(in tableView: UITableView) -> Int {
    return 1
  }
  
  override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return 3
  }
  
   override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
   let cell = tableView.dequeueReusableCell(withIdentifier: "reuseIdentifier", for: indexPath) as! TableViewCell
   
    cell.label.text = self.falseData[0]
   
   return cell
   }
  
}
