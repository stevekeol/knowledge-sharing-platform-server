module.exports.getQueryOption = path => {
  return path.map(item => {
    return {
      children: {
        $elemMatch: {
          id: item,
        }
      }
    }
  }).reduce((result, currentItem) => {
    if(!result.children) {
      result.children = currentItem.children;
      return result;
    }

    let node = result.children.$elemMatch;
    while(node.children) {
      node = node.children.$elemMatch;
    }
    node.children = currentItem.children;

    console.log(result);
    return result;
  }, {
    id: 'root'
  })
}

// //转换示例  -- 勿要删除！（可供参考）
// let path = ['department', 'id1', 'id2']
// let position = 'children.$[id0].children.$[id1].children';
// let arrayFilters = [{'id0.id': department.path[0]}, {'id1.id': department.path[1]}];

module.exports.transDepartmentCreateOption = path => {
  let result = {
    position: 'children',
    arrayFilters: []
  };
  path.map((item, index) => {
    result.position += `.$[id${index}].children`;
    result.arrayFilters.push({
      [`id${index}.id`]: path[index]
    })
  })
  return result;
}


//更新嵌套数组的某个对象
module.exports.transDepartmentUpdateOption = (_departments, _department) => {
  let path = _department.path;
  let id = _department.id;
  let departments = _departments.children;


  let result = {
    position: 'children',
    departments: [],
    arrayFilters: []
  };

  path.map((itemPath, indexPath) => {
    result.position += `.$[id${indexPath}].children`;

    departments.map((itemChildren, indexChildren) => {
      if(itemChildren.id == itemPath) {
        departments = departments[indexChildren].children;
      }
    })

    result.arrayFilters.push({
      [`id${indexPath}.id`]: path[indexPath]
    })
  })

  departments.map((itemChild, indexChild) => {
    if(itemChild.id == id) {
      for(let key in _department) {
        itemChild[key] = _department[key]; //此处对于path字段，只是简单的存储。可能需要改进
      }
    }
  })
  result.departments = departments;
  return result;
}


module.exports.transDepartmentDeleteOption = (_departments, _department) => {
  console.log(_department)
  
  let path = _department.path;
  let id = _department.id;
  let departments = _departments.children;


  let result = {
    position: 'children',
    departments: [],
    arrayFilters: []
  };

  path.map((itemPath, indexPath) => {
    result.position += `.$[id${indexPath}].children`;

    departments.map((itemChildren, indexChildren) => {
      if(itemChildren.id == itemPath) {
        departments = departments[indexChildren].children;
      }
    })

    result.arrayFilters.push({
      [`id${indexPath}.id`]: path[indexPath]
    })
  })

  departments.map((itemChild, indexChild) => {
    if(itemChild.id == id) {
      departments.splice(indexChild, 1);
    }
    // break;
  })
  result.departments = departments;
  return result;
}
