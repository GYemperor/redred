// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "redred" is now active!');
	let timeout: NodeJS.Timer | undefined = undefined;

	const redDecorationType = vscode.window.createTextEditorDecorationType({
		borderWidth: '1px',
		borderStyle: 'solid',
		overviewRulerColor: 'blue',
		backgroundColor: 'red',
		overviewRulerLane: vscode.OverviewRulerLane.Right,
		light: {
			// this color will be used in light color themes
			borderColor: 'darkblue'
		},
		dark: {
			// this color will be used in dark color themes
			borderColor: 'lightblue'
		}
	});

	const greenDecorationType = vscode.window.createTextEditorDecorationType({
		borderWidth: '1px',
		borderStyle: 'solid',
		overviewRulerColor: 'blue',
		backgroundColor: 'green',
		overviewRulerLane: vscode.OverviewRulerLane.Right,
		light: {
			// this color will be used in light color themes
			borderColor: 'darkblue'
		},
		dark: {
			// this color will be used in dark color themes
			borderColor: 'lightblue'
		}
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('redred.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from redred!');
	});

	context.subscriptions.push(disposable);

	//
	let activeEditor  = vscode.window.activeTextEditor;
	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const redRegEx = /.[Rr][Ee][Dd]\s/g;
		const greenRegEx = /.[Gg][Rr][Ee][Ee][Nn]\s/g;
		const text = activeEditor.document.getText();
		const redString: vscode.DecorationOptions[] = [];
		const greenString: vscode.DecorationOptions[] = [];
		let match;
		while ((match = redRegEx.exec(text))) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);

			const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Red:' + match[0] + '**' };
			redString.push(decoration);
		}
		activeEditor.setDecorations(redDecorationType, redString);
		while ((match = greenRegEx.exec(text))) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);

			const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Green:' + match[0] + '**' };
			greenString.push(decoration);
			// activeEditor.setDecorations(greenDecorationType, smallNumbers);
		}
		activeEditor.setDecorations(greenDecorationType, greenString);
	}

	function triggerUpdateDecorations(throttle: boolean = false) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		if (throttle) {
			timeout = setTimeout(updateDecorations, 500);
		} else {
			updateDecorations();
		}
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations(true);
		}
	}, null, context.subscriptions);
}

// this method is called when your extension is deactivated
export function deactivate() {}
