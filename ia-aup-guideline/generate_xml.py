import re
import xml.etree.ElementTree as ET
import unicodedata

def remove_vietnamese_accents(text):
    text = unicodedata.normalize('NFD', text)
    text = text.encode('ascii', 'ignore').decode('utf-8')
    return str(text)

def markdown_table_to_xml(markdown_file, xml_file):
    with open(markdown_file, 'r', encoding='utf-8') as f:
        markdown_content = f.read()

    table_regex = re.compile(r'\|(.*?)\|\n((?:\|.*?\n)+)', re.MULTILINE)
    match = table_regex.search(markdown_content)
    if not match:
        print("No markdown table found.")
        return

    header_line = match.group(1)
    headers = [h.strip() for h in header_line.split('|') if h.strip()]
    
    body_lines = match.group(2).strip().split('\n')
    
    # Find the separator line to correctly identify data rows
    separator_row_index = -1
    for i, line in enumerate(body_lines):
        if '---' in line:
            separator_row_index = i
            break
    
    # Get the data rows which are after the separator
    data_rows = body_lines[separator_row_index + 1:] if separator_row_index != -1 else []


    root = ET.Element("AUP_Procedures")

    for line in data_rows:
        if not line.strip() or '---' in line:
            continue
        
        columns = [c.strip() for c in line.split('|')]
        columns = columns[1:-1] # Remove the first and last empty strings from the split

        if len(columns) != len(headers):
            continue

        procedure = ET.SubElement(root, "Procedure")
        for i, header in enumerate(headers):
            # Create a valid XML tag name from the header
            processed_header = remove_vietnamese_accents(header)
            tag_name = re.sub(r'\s+', '_', processed_header)
            tag_name = re.sub(r'[^\w]', '', tag_name)
            
            child = ET.SubElement(procedure, tag_name)
            child.text = columns[i]

    tree = ET.ElementTree(root)
    ET.indent(tree, space="\t", level=0)
    tree.write(xml_file, encoding='utf-8', xml_declaration=True)

if __name__ == "__main__":
    markdown_table_to_xml('AUP_procedures_vi.md', 'AUP_procedures_vi.xml')
