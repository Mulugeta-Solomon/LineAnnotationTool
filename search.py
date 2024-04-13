class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


def search_bst(node, value):
    if node is None:
        return False
    
    if node.value == value:
        return True 
    elif node.value < value:
        return search_bst(node.right, value)
    else:
        return search_bst(node.left, value)