import sys
from pycparser import c_parser, c_ast, parse_file

class ComplexityAnalyzer(c_ast.NodeVisitor):
    def __init__(self):
        self.complexity = "O(1)"
        self.loop_depth = 0
        self.nested_loops = 0

    def visit_For(self, node):
        self.loop_depth += 1
        self.nested_loops += 1
        self.generic_visit(node)
        self.loop_depth -= 1
        self.nested_loops -= 1

        if self.loop_depth > 0:
            self.update_complexity()

    def visit_While(self, node):
        self.loop_depth += 1
        self.nested_loops += 1
        self.generic_visit(node)
        self.loop_depth -= 1
        self.nested_loops -= 1

        if self.loop_depth > 0:
            self.update_complexity()

    def visit_If(self, node):
        self.generic_visit(node)  # Visit the body of the if statement
        # If-else statements do not affect complexity directly, just visit

    def visit_FuncDef(self, node):
        self.generic_visit(node)

    def update_complexity(self):
        if self.loop_depth == 1:
            self.complexity = "O(n)"
        elif self.loop_depth > 1:
            self.complexity = "O(n^" + str(self.loop_depth) + ")"  # For nested loops

    def analyze(self, code):
        try:
            ast = c_parser.CParser().parse(code)
            self.visit(ast)
        except Exception as e:
            return f"Error analyzing code: {str(e)}"
        return self.complexity

def analyze_time_complexity(c_code):
    analyzer = ComplexityAnalyzer()
    return analyzer.analyze(c_code)

if __name__ == "__main__":
    # Read C code from standard input
    c_code = sys.stdin.read()
    complexity = analyze_time_complexity(c_code)
    print(complexity)
