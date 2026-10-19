# AutoNekoKey-Input-Simulator

**Version:** 1.0.0  
**Author:** 绘河HUIHE  
**License:** [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

[简体中文](#简体中文) | [English](#english)

---

# 简体中文

## 项目简介

**AutoNekoKey-Input-Simulator** 是一款基于 Tampermonkey（油猴）的用户脚本，用于在网页中模拟文本输入。

在某些网站或网页输入框中，直接粘贴文本可能不可用、受到限制，或无法正常工作。本脚本旨在提供一种替代输入方式，帮助用户将文本输入到网页输入框中。

本项目仅用于合法、合理的文本输入辅助，不应被用于规避网站安全机制、破坏公平性或违反网站规则。

## 功能特性

- **模拟文本输入：** 模拟用户逐步输入指定文本的过程，具体行为取决于脚本实现。
- **辅助网页输入：** 为不支持粘贴或粘贴功能不稳定的输入框提供替代方案。
- **油猴脚本支持：** 通过 Tampermonkey 或兼容的用户脚本管理器运行。
- **简单易用：** 安装并启用脚本后，可按照脚本提供的操作方式在支持的网页中使用。
- **专注输入辅助：** 本项目用于辅助文本输入，不以自动生成答案或代替用户完成考核为目的。

## 安装方法

### 1. 安装 Tampermonkey

首先，在浏览器中安装 Tampermonkey（油猴）或其他兼容的用户脚本管理器。

请通过浏览器官方扩展商店或可信的官方渠道获取相关软件。

### 2. 安装用户脚本

1. 获取本项目提供的用户脚本文件。
2. 打开 Tampermonkey 管理面板。
3. 根据管理器支持的方式导入或新建脚本。
4. 将项目脚本内容添加到编辑器中。
5. 保存脚本，并确认脚本已启用。

> 请只从可信来源获取脚本。安装前建议检查脚本内容，避免运行未经审查的代码。

## 使用方法

1. 确认 Tampermonkey 已安装，且本项目脚本已启用。
2. 打开需要输入文本的网页。
3. 根据脚本实际提供的界面或操作方式，选择或输入需要录入的文本。
4. 在目标输入框中使用脚本提供的输入功能。
5. 输入完成后，检查内容是否完整、准确，再决定是否提交。

不同网站的输入框实现、事件处理方式和安全限制可能有所不同，因此本脚本不保证适用于所有网页。

## 使用规范与免责声明

本项目仅用于合法、合理的文本输入辅助。使用者必须遵守适用法律法规、网站服务条款、平台规则及相关机构的管理要求。

**严禁将本项目用于以下用途，包括但不限于：**

- 在考试、测验、作业、在线答题或其他考核中作弊。
- 侵犯他人著作权、传播盗版内容或从事其他侵权行为。
- 未经授权使用、复制或传播付费海报及其他受保护的付费内容。
- 输入、传播或协助传播违法违规、侵害他人权益或违反平台规则的内容。
- 制作、传播或提交违反适用法律法规、公共秩序或公序良俗的内容。
- 规避网站的安全机制、访问限制或反滥用措施。
- 以任何方式干扰网站、服务或其他用户的正常使用。

使用者应自行判断使用场景是否合法、合规，并对使用本项目所产生的行为及后果承担相应责任。

作者不鼓励任何违反法律法规、考试纪律、学术诚信要求或平台规则的使用行为。使用者应对自身的不当使用行为及其产生的后果承担相应责任。

## 隐私与安全

- 本项目的实际数据处理行为取决于所使用的脚本版本及其代码实现。
- 安装前请检查脚本代码，确认其行为符合自己的预期。
- 不要向不可信的网页或脚本提供密码、身份验证信息、个人隐私或其他敏感数据。
- 使用本项目时，请留意目标网站的隐私政策、服务条款及相关安全要求。

除非经过代码审查或其他可靠方式验证，否则请勿假定脚本绝对不会收集、存储或传输任何数据。

## 兼容性

本项目面向支持用户脚本的浏览器环境，并依赖 Tampermonkey 或兼容的用户脚本管理器。

实际兼容性可能受到以下因素影响：

- 浏览器及其版本。
- 用户脚本管理器及其版本。
- 网页输入框的类型与前端实现。
- 网站对输入事件、粘贴行为及自动化操作的限制。
- 网页自身的安全策略和动态更新。

因此，本项目不保证能够在所有网站或所有输入框中正常工作。

## 版权与许可证

Copyright © 绘河HUIHE

本项目采用 **知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议（CC BY-NC-SA 4.0）** 进行授权。

协议全文：

https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans

在遵守该许可证条款的前提下，您可以：

- **共享：** 以任何媒介或格式复制、发行本作品。
- **改编：** 对本作品进行重混、转换或再创作。

但您必须遵守以下条件：

- **署名（BY）：** 适当标明原作者、提供许可证链接，并说明是否对作品进行了修改。您可以以合理方式履行这些义务，但不得以任何方式暗示原作者认可您或您的使用方式。
- **非商业性使用（NC）：** 不得将本作品用于商业目的。
- **相同方式共享（SA）：** 如果您对本作品进行改编、转换或再创作，必须按照与原作品相同或兼容的许可证分发您的贡献。

不得增加法律条款或技术措施，限制他人行使本许可证所授予的权利。

本许可证不影响适用的法定例外与限制，也不代表您自动获得商标、专利、隐私权或其他不属于本许可证授权范围的权利。

请阅读上述许可证的完整法律文本，以了解具体权利、限制及适用条件。

## 作者

**绘河HUIHE**

---

# English

## Introduction

**AutoNekoKey-Input-Simulator** is a Tampermonkey userscript designed to simulate text input on web pages.

On some websites or in certain input fields, pasting text may be unavailable, restricted, or unreliable. This script aims to provide an alternative input method to help users enter text into web page input fields.

This project is intended solely for lawful and appropriate text-input assistance. It must not be used to bypass website security mechanisms, undermine fair practices, or violate website rules.

## Features

- **Simulated text input:** Simulates the process of entering specified text incrementally, depending on the script's implementation.
- **Web input assistance:** Provides an alternative for input fields where pasting is unavailable or unreliable.
- **Userscript support:** Runs through Tampermonkey or another compatible userscript manager.
- **Simple workflow:** Once installed and enabled, the script can be used on supported web pages according to its available controls.
- **Focused on input assistance:** The project is intended to assist with text input, not to generate answers automatically or complete assessments on behalf of users.

## Installation

### 1. Install Tampermonkey

Install Tampermonkey or another compatible userscript manager in your browser.

Obtain the extension through your browser's official extension store or another trusted official source.

### 2. Install the Userscript

1. Obtain the userscript file provided by this project.
2. Open the Tampermonkey dashboard.
3. Import the script or create a new script, depending on the manager's supported workflow.
4. Add the project script's contents to the editor.
5. Save the script and make sure it is enabled.

> Only obtain scripts from trusted sources. Review the source code before installation to avoid running untrusted code.

## Usage

1. Make sure Tampermonkey is installed and the project script is enabled.
2. Open the web page where you need to enter text.
3. Use the interface or controls provided by the script to select or enter the text you want to input.
4. Activate the script's input function in the target field.
5. After the input process finishes, check the result for completeness and accuracy before submitting it.

Websites may implement input fields, event handling, and security restrictions differently. Therefore, compatibility with every website is not guaranteed.

## Responsible Use and Disclaimer

This project is intended solely for lawful and appropriate text-input assistance. Users must comply with applicable laws and regulations, website terms of service, platform policies, and relevant institutional requirements.

**The following uses are strictly prohibited, including but not limited to:**

- Cheating in examinations, tests, assignments, online quizzes, or other forms of assessment.
- Infringing copyrights, distributing pirated content, or engaging in other intellectual property violations.
- Using, copying, or distributing paid posters or other protected paid content without authorization.
- Entering, distributing, or facilitating the distribution of unlawful content, content that violates others' rights, or content prohibited by platform rules.
- Creating, distributing, or submitting content that violates applicable laws and regulations, public order, or generally accepted standards of conduct.
- Circumventing website security mechanisms, access restrictions, or anti-abuse measures.
- Interfering with the normal operation of websites or services, or disrupting other users' access.

Users are responsible for determining whether their intended use is lawful and compliant, and for the actions they take and the consequences arising from their use of this project.

The author does not encourage any use that violates applicable laws, examination rules, academic integrity requirements, or platform policies. Users are responsible for the consequences of any misuse of this project.

## Privacy and Security

- The project's actual data-handling behavior depends on the version of the script being used and its implementation.
- Review the source code before installation to ensure that its behavior matches your expectations.
- Do not provide passwords, authentication credentials, personal information, or other sensitive data to untrusted web pages or scripts.
- Observe the privacy policies, terms of service, and security requirements of the target website.

Unless verified through source-code review or another reliable method, do not assume that the script never collects, stores, or transmits data.

## Compatibility

This project is intended for browser environments that support userscripts and requires Tampermonkey or a compatible userscript manager.

Actual compatibility may depend on:

- The browser and its version.
- The userscript manager and its version.
- The type and implementation of the web page's input fields.
- Website restrictions on input events, pasting, and automated interactions.
- The website's security policies and ongoing updates.

Compatibility with every website or input field is not guaranteed.

## Copyright and License

Copyright © 绘河HUIHE

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)**.

Full license text:

https://creativecommons.org/licenses/by-nc-sa/4.0/

Under the terms of this license, you are free to:

- **Share:** Copy and redistribute the material in any medium or format.
- **Adapt:** Remix, transform, and build upon the material.

These freedoms are subject to the following terms:

- **Attribution (BY):** You must give appropriate credit, provide a link to the license, and indicate whether changes were made. You may do so in any reasonable manner, but not in any way that suggests the author endorses you or your use.
- **NonCommercial (NC):** You may not use the material for commercial purposes.
- **ShareAlike (SA):** If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original or a compatible license.

You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.

This license does not affect applicable exceptions and limitations to copyright. It also does not automatically grant trademark, patent, privacy, or other rights that are outside the scope of the license.

Please read the full legal code of the license to understand all applicable rights, obligations, and restrictions.

## Author

**绘河HUIHE**
