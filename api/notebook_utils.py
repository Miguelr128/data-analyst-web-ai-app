import nbformat
from nbformat.v4 import new_notebook, new_code_cell, new_markdown_cell

def create_jupyter_notebook(cells_data):
    """
    Creates a Jupyter Notebook object from a list of cell data.
    """
    nb = new_notebook()
    for cell in cells_data:
        if cell['type'] == 'code':
            nb.cells.append(new_code_cell(cell['content']))
        else:
            nb.cells.append(new_markdown_cell(cell['content']))
    return nb

def save_notebook(nb, filepath):
    """
    Saves a notebook object to a file.
    """
    with open(filepath, 'w', encoding='utf-8') as f:
        nbformat.write(nb, f)
