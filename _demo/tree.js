/* 二叉树的遍历：

先序遍历：根左右
中序遍历：左根右
后续遍历：左右根

 */

const tree = {
  value: 1,
  left: {
    value: 3,
    left: {
      value: 7,
      left: {
        value:10
      }
    },
    right: {
      value: 8
    }
  },
  right: {
    value: 6,
    left: {
      value: 4,
      right: {
        value: 5
      }
    }
  }
}

function pre (tree) {
  let result = [], stack = [];
  if (!tree) return ;
  stack.push(tree)
  while (stack.length) {
    let node = stack.pop();
    result.push(node.value);
    if (node.right) {
      stack.push(node.right);
    }
    if(node.left) {
      stack.push(node.left);
    }
  }
  return result;
}


// 中序遍历有点绕
function middle (tree) {
  let result = [], stack = [];
  if (!tree) return ;
  while(true) {
    // 先处理左子树，左子树到叶子节点的时候，出栈叶子节点，输出值，
    // 再处理出站节点的右子树，
    while (tree) {
      stack.push(tree)
      tree = tree.left
    }
    if (stack.length === 0) {
      break;
    }
    let node = stack.pop();
    result.push(node.value);
    tree = node.right;

  } 
  return result;
}

function last () {
  let result = [], stack = [];
  
}
