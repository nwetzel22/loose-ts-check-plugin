import path from "path";
import LooseTsCheckPlugin from "./loose-ts-check-plugin";

function init(modules: { typescript: typeof import("typescript/lib/tsserverlibrary") }) {
    const ts = modules.typescript;

    function create(info: ts.server.PluginCreateInfo) {
      // Set up decorator object
      const proxy: ts.LanguageService = Object.create(null);

      for (let k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
        const x = info.languageService[k]!;
        // @ts-expect-error - JS runtime trickery which is tricky to type tersely
        proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
      }

      const logger = info.project.projectService.logger;
      logger.info("Setting up loose-ts-check-plugin.");

      const projectDirectoryPath = info.project.getCurrentDirectory().normalize();
      logger.info(`Project directory path: ${projectDirectoryPath}.`);

      const pathToLooselyTypeCheckedFiles: string = info.config.pathToLooselyTypeCheckedFiles;
      logger.info(`Path to loosely type checked files JSON: ${pathToLooselyTypeCheckedFiles}.`);

      const pathToIgnoredErrorCodes: string = info.config.pathToIgnoredErrorCodes;
      logger.info(`Path to ignored error codes JSON: ${pathToIgnoredErrorCodes}.`);
      
      const looseTsCheckPlugin = new LooseTsCheckPlugin(
        logger.info.bind(logger),
        projectDirectoryPath,
        pathToLooselyTypeCheckedFiles,
        pathToIgnoredErrorCodes
      );

      proxy.getSemanticDiagnostics = (fileName: string) => {
        const diagnostics = info.languageService.getSemanticDiagnostics(fileName);
        return diagnostics.filter((d) => looseTsCheckPlugin.shouldDiagnosticBeReported(d));
      };

      proxy.getSyntacticDiagnostics = (fileName: string) => {
        const diagnostics = info.languageService.getSyntacticDiagnostics(fileName);
        return diagnostics.filter((d) => looseTsCheckPlugin.shouldDiagnosticBeReported(d));
      };

      return proxy;
    }

    return { create };
  }

  export = init;
