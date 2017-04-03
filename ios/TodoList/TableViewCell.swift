//
//  TableViewCell.swift
//  TodoList
//
//  Created by Kotaro Hirayama on 2017/04/05.
//  Copyright © 2017 Kotaro Hirayama. All rights reserved.
//

import UIKit

class TableViewCell: UITableViewCell {

  @IBOutlet weak var label: UILabel!
  
  override func awakeFromNib() {
    super.awakeFromNib()
    // Initialization code
  }
  
  override func setSelected(_ selected: Bool, animated: Bool) {
    super.setSelected(selected, animated: animated)
    
    // Configure the view for the selected state
  }
}
