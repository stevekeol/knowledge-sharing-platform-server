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
// let path = ['id0', 'id1']
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

//能否精简?
module.exports.transPathCreateOption = path => {
  if(path.length === 1) {
    return {
      position: 'articles',
      arrayFilters: []      
    }
  } else {
    let result = {
      position: 'articles',
      arrayFilters: []
    };
    path.shift();
    path.map((item, index) => {
      result.position += `.$[id${index}].children`;
      result.arrayFilters.push({
        [`id${index}.id`]: path[index]
      })
    })
    console.log(result)
    return result;
  }
}




module.exports.transPathUpdateOption = (pathTree, _path) => {
  let path = _path.path;
  let id = _path.id;


  return {
    position: 'articles',
    pathTree: _path.data,
    arrayFilters: []
  }    

  path.shift();
  path.push(id)

  let result = {
    position: 'articles',
    pathTree: [],
    arrayFilters: []
  };

  path.map((itemPath, indexPath) => {

    result.position += `.$[id${indexPath}].children`;

    pathTree.map((itemChildren, indexChildren) => {
      if(itemChildren.id == itemPath) {
        pathTree = pathTree[indexChildren].children;
      }
    })

    result.arrayFilters.push({
      [`id${indexPath}.id`]: path[indexPath]
    })
  })

  pathTree.map((itemChild, indexChild) => {
    if(itemChild.id == id) {
      for(let key in _path.data) {
        itemChild[key] = _path[key]; //此处对于path字段，只是简单的存储。可能需要改进
      }  
    }
  })
  result.pathTree = pathTree;
  console.log(result)
  return result;
}



module.exports.transPathDeleteOption = (_pathTree, _path) => {
  
  let path = _path.path;
  let id = _path.id;
  let pathTree = _pathTree.articles;


  let result = {
    position: 'articles',
    pathTree: [],
    arrayFilters: []
  };

  path.map((itemPath, indexPath) => {
    result.position += `.$[id${indexPath}].children`;

    pathTree.map((itemChildren, indexChildren) => {
      if(itemChildren.id == itemPath) {
        pathTree = pathTree[indexChildren].children;
      }
    })

    result.arrayFilters.push({
      [`id${indexPath}.id`]: path[indexPath]
    })
  })

  pathTree.map((itemChild, indexChild) => {
    if(itemChild.id == id) {
      pathTree.splice(indexChild, 1);
    }
    // break;
  })
  result.pathTree = pathTree;
  return result;
}

module.exports.transArticleCreateOption = path => {
  let result = {
    position: 'articles',
    arrayFilters: []
  };
  path.map((item, index) => {
    result.position += `.$[id${index}].children`;
    result.arrayFilters.push({
      [`id${index}.id`]: path[index]
    })
  })
  console.log(result);
  return result;
}

module.exports.transArticleUpdateOption = (articlesTree, article) => {
  let path = article.path;
  let id = article.id;
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