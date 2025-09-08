package com.banijjo.Banjijjo.util;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

public class CsvExportUtil {
    public static byte[] toCsv(List<String[]> rows) {
        String content = rows.stream()
                .map(cols -> {
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < cols.length; i++) {
                        if (i > 0) sb.append(',');
                        sb.append(escape(cols[i] == null ? "" : cols[i]));
                    }
                    return sb.toString();
                })
                .collect(Collectors.joining("\n")) + "\n";
        return content.getBytes(StandardCharsets.UTF_8);
    }

    private static String escape(String s) {
        boolean needsQuotes = s.contains(",") || s.contains("\n") || s.contains("\"");
        String escaped = s.replace("\"", "\"\"");
        return needsQuotes ? "\"" + escaped + "\"" : escaped;
    }
}
