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

// //示例
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
