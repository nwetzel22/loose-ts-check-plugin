# Loose TS Check Plugin

The `loose-ts-check-plugin` supplements [loose-ts-check](https://github.com/Gelio/loose-ts-check), providing a plugin for
the TypeScript Language Server. All errors ignored by `loose-ts-check` will also
be ignored by the TypeScript Language Server, enabling congruency between the TS
compiler output and intellisense within your code editor.

## Installation

Install the utility with:

```sh
npm install loose-ts-check-plugin --save-dev
```

## Usage

Loosely checked file names and error codes can be generated with the `loose-ts-check` tool.
This plugin will read the same outputs and integrate them into the language server plugin.

In order, to enable this plugin, modify your `tsconfig.json` as follows:

```sh
{
    "compilerOptions": {
        "plugins": [{
            "name": "loose-ts-check-plugin",
            "pathToLooselyTypeCheckedFiles": "./loosely-type-checked-files.json",
            "pathToIgnoredErrorCodes": "./ignored-error-codes.json"
        }]
    },
}
```
Paths to relevant JSON files need to be provided.

## Development

To verify the correctness, run:

```sh
npm run test
```

## Editor Support
VS Code is the only tested and verified editor for this plugin. Visual Studio does not appear to support TS plugins,
though a request has been made. Support for other editors is unknown at this time.

## Contributing

Contributions are welcome!

Make sure the CI passes on your PRs, and that your code is covered by unit
tests.
