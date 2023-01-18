import { Handlebars, ViewEngine, ViewEngineOptions } from "./deps.ts";

export class HandlebarsEngine extends ViewEngine {
  constructor(options?: Partial<ViewEngineOptions>) {
    super(Handlebars, options);
  }

  async registerPartial(partial: string): Promise<void> {
    const templateFile = await this.getPartialTemplate(partial);
    this.engine.registerPartial(partial, templateFile);
  }

  registerHelper(
    helperName: string,
    helperFunction: (...args: unknown[]) => unknown,
  ): Promise<void> {
    this.engine.registerHelper(helperName, helperFunction);
    return Promise.resolve();
  }

  async view(
    template: string,
    data: Record<string, unknown>,
    options: Partial<ViewEngineOptions> = {},
  ): Promise<string> {
    options = { ...this.options, ...options };

    const templateFile = await this.getViewTemplate(template);
    const pageTmpl = await this.engine.compile(templateFile);
    const content = pageTmpl(data);

    if (options.layout) {
      const layoutFile = await this.getLayoutTemplate(options.layout);
      const layoutTmpl = await this.engine.compile(layoutFile);
      return layoutTmpl({ ...data, content });
    }

    return content;
  }

  async partial(
    template: string,
    data: Record<string, unknown>,
    options: Partial<ViewEngineOptions> = {},
  ): Promise<string> {
    options = { ...this.options, ...options };

    if (!this.engine.partials[template]) {
      await this.registerPartial(template);
    }

    const pageTmpl = await this.engine.compile('{{> "' + template + '"}}');
    return pageTmpl(data);
  }
}
