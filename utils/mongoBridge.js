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

let obj = {
  "children": [
      {
          "id": "department",
          "name": "全部部门",
          "desc": "部门类",
          "children": [
              {
                  "id": "id1",
                  "name": "部门1",
                  "desc": "部门1",
                  "children": [
                      {
                          "id": "id10",
                          "name": "部门10",
                          "desc": "部门10",
                          "children": [],
                          "members": [],
                          "sequence": 1,
                          "writable": false
                      },
                      {
                          "path": [
                              "department",
                              "id1"
                          ],
                          "children": [],
                          "members": [],
                          "name": "UI",
                          "desc": "===========",
                          "parent": "department",
                          "sequence": 0,
                          "writable": false,
                          "id": "55783b05-1bbf-49ff-a046-a231d981cea3"
                      },
                      {
                          "path": [
                              "department",
                              "id1"
                          ],
                          "children": [],
                          "members": [],
                          "name": "UI",
                          "desc": "===========",
                          "parent": "department",
                          "sequence": 0,
                          "writable": false,
                          "id": "37be839d-2693-4b60-a2fa-33391abbf453"
                      },
                      {
                          "path": [
                              "department",
                              "id1"
                          ],
                          "children": [],
                          "members": [],
                          "name": "UI",
                          "desc": "===========",
                          "parent": "department",
                          "sequence": 0,
                          "writable": false,
                          "id": "d92b1c79-079d-47ad-9609-7f85d13c4a7e"
                      },
                      {
                          "path": [
                              "department",
                              "id1"
                          ],
                          "children": [],
                          "members": [],
                          "name": "UI",
                          "desc": "===========",
                          "parent": "department",
                          "sequence": 0,
                          "writable": false,
                          "id": "c4256759-b5cb-4b99-80b0-12b7781633e4"
                      },
                      {
                          "path": [
                              "department",
                              "id1"
                          ],
                          "children": [],
                          "members": [],
                          "name": "UI",
                          "desc": "------------------",
                          "parent": "department",
                          "sequence": 0,
                          "writable": false,
                          "id": "6b038317-1222-40c3-a9a8-75d3718fbdf6"
                      },
                      {
                          "path": [
                              "department",
                              "id1"
                          ],
                          "children": [],
                          "members": [],
                          "name": "UI",
                          "desc": "------------------",
                          "parent": "department",
                          "sequence": 0,
                          "writable": false,
                          "id": "f1e7f511-bbb3-4b71-b030-b5a708f05c01"
                      }
                  ],
                  "members": [],
                  "sequence": 1,
                  "writable": false
              },
              {
                  "id": "id2",
                  "name": "部门2",
                  "desc": "部门2",
                  "children": [],
                  "members": [],
                  "sequence": 1,
                  "writable": false
              },
              {
                  "path": [
                      "department",
                      "id1"
                  ],
                  "children": [],
                  "members": [],
                  "name": "UI",
                  "desc": "abcdefg",
                  "parent": "department",
                  "sequence": 0,
                  "writable": false,
                  "id": "15839119-d033-4f16-aa3e-6a6fcb984c2c"
              }
          ],
          "members": [],
          "sequence": 0,
          "writable": true
      },
      {
          "id": "group",
          "name": "全部小组",
          "desc": "项目小组",
          "children": [
              {
                  "path": [
                      "group"
                  ],
                  "children": [],
                  "members": [],
                  "name": "UI",
                  "desc": "部门描述12333333333333333",
                  "parent": "department",
                  "sequence": 0,
                  "writable": false,
                  "id": "25b91c2d-86fe-42b7-8bc3-758fc1d162fa"
              },
              {
                  "path": [
                      "group",
                      "25b91c2d-86fe-42b7-8bc3-758fc1d162fa"
                  ],
                  "children": [],
                  "members": [],
                  "name": "UI",
                  "desc": "部门描述12333333333333333",
                  "parent": "department",
                  "sequence": 0,
                  "writable": false,
                  "id": "7ca50882-21b7-4566-be2e-4d8b132547fd"
              },
              {
                  "path": [
                      "group"
                  ],
                  "children": [],
                  "members": [],
                  "name": "UI",
                  "desc": "部门描述12333333333333333",
                  "parent": "department",
                  "sequence": 0,
                  "writable": false,
                  "id": "55146240-1728-4255-87de-ad9d0d29c785"
              },
              {
                  "path": [
                      "group"
                  ],
                  "children": [],
                  "members": [],
                  "name": "UI",
                  "desc": "部门描述12333333333333333",
                  "parent": "department",
                  "sequence": 0,
                  "writable": false,
                  "id": "d1cd512b-5509-4ac5-ad12-ce7fa9d67622"
              },
              {
                  "path": [
                      "group"
                  ],
                  "children": [],
                  "members": [],
                  "name": "UI",
                  "desc": "部门描述12333333333333333",
                  "parent": "department",
                  "sequence": 0,
                  "writable": false,
                  "id": "a696c045-965c-49ed-9a16-fc4f434f8ecd"
              },
              {
                  "path": [
                      "group"
                  ],
                  "children": [],
                  "members": [],
                  "name": "UI",
                  "desc": "abcdefg",
                  "parent": "department",
                  "sequence": 0,
                  "writable": false,
                  "id": "55aa183a-7cfd-41e4-b86d-c12e0aded2f3"
              }
          ],
          "members": [],
          "sequence": 1,
          "writable": false
      }
  ],
  "authors": [],
  "_id": "5f33bfc446ab68059466042b",
  "id": "root",
  "name": "本能&巴根",
  "desc": "组织架构",
  "members": [],
  "sequence": 0,
  "writable": false
}

// let path = ['department', 'id1'];
let department = {
  "id": "id10",
  "path": ["department", "id1"],
  "children": [],
  "members": [],
  "name": "UI",
  "desc": "-----************-------------",
  "parent": "department",
  "sequence": 0,
  "writable": false
}

// obj.children[0].children[0].children = []

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
