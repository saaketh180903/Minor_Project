import sys
import json
from pycparser import c_parser, c_ast

# Function to preprocess C code and remove unsupported constructs
def preprocess_code(code):
    lines = code.splitlines()
    filtered_lines = []

    for line in lines:
        # Skip preprocessor directives (like #include) and empty lines
        if line.startswith("#") or line.strip() == "":
            continue
        # Skip single-line comments
        if line.strip().startswith("//"):
            continue
        # Remove multiline comments
        line = line.split("/*")[0]
        filtered_lines.append(line)

    return "\n".join(filtered_lines)

# Custom AST visitor to analyze code complexity
class ComplexityAnalyzer(c_ast.NodeVisitor):
    def __init__(self):
        self.loop_count = 0
        self.recursive_calls = 0

    def visit_For(self, node):
        self.loop_count += 1
        self.generic_visit(node)

    def visit_While(self, node):
        self.loop_count += 1
        self.generic_visit(node)

    def visit_DoWhile(self, node):
        self.loop_count += 1
        self.generic_visit(node)

    def visit_FuncCall(self, node):
        if isinstance(node.name, c_ast.ID) and node.name.name in self.current_function:
            self.recursive_calls += 1
        self.generic_visit(node)

    def visit_FuncDef(self, node):
        self.current_function = node.decl.name
        self.generic_visit(node)

    def get_complexity_report(self):
        report = {
            "total_loops": self.loop_count,
            "total_recursive_calls": self.recursive_calls,
            "estimated_time_complexity": self.estimate_time_complexity()
        }
        return report

    def estimate_time_complexity(self):
        if self.loop_count == 0 and self.recursive_calls == 0:
            return "O(1)"
        elif self.loop_count == 1 and self.recursive_calls == 0:
            return "O(n)"
        elif self.loop_count > 1:
            return f"O(n^{self.loop_count})"
        elif self.recursive_calls > 0:
            return "Exponential or factorial"

# Function to analyze the time complexity of the given C code
def analyze_code_complexity(code):
    parser = c_parser.CParser()
    try:
        # Preprocess the code to remove unsupported constructs
        preprocessed_code = preprocess_code(code)
        ast = parser.parse(preprocessed_code)
        analyzer = ComplexityAnalyzer()
        analyzer.visit(ast)
        complexity_report = analyzer.get_complexity_report()
        return json.dumps(complexity_report)
    except Exception as e:
        return json.dumps({"error": f"Error parsing code: {e}"})


# Main execution
if __name__ == "__main__":
    # Read C code from standard input
    c_code = sys.argv[1]
    # file_path = sys.argv[1]
    # with open(file_path, 'r') as file:
    #     c_code = file.read()
    complexity_report = analyze_code_complexity(c_code)
    print(complexity_report)
    sys.stdout.flush()

